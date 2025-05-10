use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("BYTpfCh7SyGQWzGv24aE5G2r5vD1stRj3dRZ8LTe3SF4");

#[program]
pub mod crowdfunding {
    use super::*;

    // Initialize a new campaign
    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        description: String,
        goal: u64,     // Funding goal in lamports
        duration: i64, // Duration in seconds
    ) -> Result<()> {
        // Validate inputs
        require!(!title.is_empty(), ErrorCode::InvalidInput);
        require!(!description.is_empty(), ErrorCode::InvalidInput);
        require!(goal > 0, ErrorCode::InvalidInput);
        require!(duration > 0, ErrorCode::InvalidInput);

        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = *ctx.accounts.creator.key;
        campaign.title = title;
        campaign.description = description;
        campaign.goal = goal;
        campaign.raised = 0;
        campaign.backers = 0;
        campaign.created_at = Clock::get()?.unix_timestamp;
        campaign.ends_at = campaign.created_at + duration;
        campaign.active = true;
        campaign.canceled = false;
        campaign.funds_withdrawn = false;

        Ok(())
    }

    // Pledge SOL to a campaign (could be from streaming payment frontend)
    pub fn pledge(ctx: Context<Pledge>, amount: u64) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;

        {
            let campaign = &mut ctx.accounts.campaign;
            // Ensure campaign is active, not canceled, and not expired
            require!(
                campaign.active && !campaign.canceled && current_time < campaign.ends_at,
                ErrorCode::CampaignNotActive
            );
        }

        // Transfer SOL from backer to campaign account
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.backer.key(),
            &ctx.accounts.campaign.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.backer.to_account_info(),
                ctx.accounts.campaign.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        {
            let campaign_key = ctx.accounts.campaign.key();
            let campaign = &mut ctx.accounts.campaign;

            // Update campaign stats
            campaign.raised += amount;
            campaign.backers += 1;

            // Check if goal reached and mark campaign inactive
            if campaign.raised >= campaign.goal {
                campaign.active = false;

                emit!(GoalReachedEvent {
                    campaign: campaign_key,
                    goal: campaign.goal,
                    raised: campaign.raised,
                });
            }
        }

        emit!(PledgeEvent {
            campaign: ctx.accounts.campaign.key(),
            backer: ctx.accounts.backer.key(),
            amount,
        });

        Ok(())
    }

    // Cancel a campaign (only creator)
    pub fn cancel_campaign(ctx: Context<CancelCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(
            ctx.accounts.creator.key() == campaign.creator,
            ErrorCode::Unauthorized
        );
        require!(campaign.active, ErrorCode::CampaignNotActive);
        campaign.active = false;
        campaign.canceled = true;

        emit!(CancelEvent {
            campaign: ctx.accounts.campaign.key(),
        });

        Ok(())
    }

    // End campaign (creator deactivates without canceling)
    pub fn end_campaign(ctx: Context<EndCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(
            ctx.accounts.creator.key() == campaign.creator,
            ErrorCode::Unauthorized
        );
        require!(campaign.active, ErrorCode::CampaignNotActive);
        campaign.active = false;

        Ok(())
    }

    // Withdraw funds (available for creator anytime)
    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;

        // Validate conditions
        require!(
            ctx.accounts.creator.key() == campaign.creator,
            ErrorCode::Unauthorized
        );
        require!(!campaign.funds_withdrawn, ErrorCode::FundsAlreadyWithdrawn);

        // Get campaign's lamports
        let campaign_lamports = campaign.to_account_info().lamports();
        require!(campaign_lamports > 0, ErrorCode::InsufficientFunds);

        // Calculate amount to withdraw (keeping rent-exempt minimum)
        let rent = Rent::get()?;
        let rent_exempt_minimum = rent.minimum_balance(campaign.to_account_info().data_len());

        // Calculate withdrawal amount
        let withdraw_amount = campaign_lamports
            .checked_sub(rent_exempt_minimum)
            .ok_or(ErrorCode::InsufficientFunds)?;

        // Transfer funds
        **campaign.to_account_info().try_borrow_mut_lamports()? -= withdraw_amount;
        **ctx.accounts.creator.try_borrow_mut_lamports()? += withdraw_amount;

        campaign.funds_withdrawn = true;

        emit!(WithdrawEvent {
            campaign: campaign.key(),
            creator: campaign.creator,
            amount: withdraw_amount,
        });

        Ok(())
    }
}

// Account structures
#[account]
pub struct Campaign {
    pub creator: Pubkey,       // Creator's public key
    pub title: String,         // Campaign title
    pub description: String,   // Campaign description
    pub goal: u64,             // Funding goal in lamports
    pub raised: u64,           // Total SOL raised
    pub backers: u64,          // Number of backers (incremental counter)
    pub created_at: i64,       // Timestamp of creation
    pub ends_at: i64,          // Timestamp of campaign end
    pub active: bool,          // Is campaign active?
    pub canceled: bool,        // Is campaign canceled?
    pub funds_withdrawn: bool, // Have funds been withdrawn?
}

// Contexts
#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct CreateCampaign<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 4 + title.len() + 4 + description.len() + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 1,
        seeds = [b"campaign", creator.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Pledge<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub backer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelCampaign<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct EndCampaign<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Custom errors
#[error_code]
pub enum ErrorCode {
    #[msg("Campaign is not active, canceled, or has ended")]
    CampaignNotActive,
    #[msg("Unauthorized: Only the creator can perform this action")]
    Unauthorized,
    #[msg("Invalid input parameters")]
    InvalidInput,
    #[msg("Funds have already been withdrawn")]
    FundsAlreadyWithdrawn,
    #[msg("Insufficient funds for operation")]
    InsufficientFunds,
}

// Events
#[event]
pub struct PledgeEvent {
    pub campaign: Pubkey,
    pub backer: Pubkey,
    pub amount: u64,
}

#[event]
pub struct GoalReachedEvent {
    pub campaign: Pubkey,
    pub goal: u64,
    pub raised: u64,
}

#[event]
pub struct CancelEvent {
    pub campaign: Pubkey,
}

#[event]
pub struct WithdrawEvent {
    pub campaign: Pubkey,
    pub creator: Pubkey,
    pub amount: u64,
}
