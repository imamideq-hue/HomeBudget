import type { BudgetData } from '@/models';

/**
 * Initial dataset for a brand-new user: a clean slate. Accounts and categories
 * exist so the user can start logging, but every amount is zero — no
 * transactions, no balances, no saved goal progress, no budgets yet.
 */

export const SPACE_ID = 'space_home';
export const USER_ME = 'user_me';

const ACC_CHECKING = 'acc_checking';
const ACC_CASH = 'acc_cash';
const ACC_SAVINGS = 'acc_savings';

const NOW = new Date().toISOString();

export const SEED_DATA: BudgetData = {
  currentUserId: USER_ME,
  currentSpaceId: SPACE_ID,

  users: [{ id: USER_ME, name: 'You', color: '#7C5CFC', createdAt: NOW }],

  spaces: [
    {
      id: SPACE_ID,
      name: 'Household',
      ownerId: USER_ME,
      currency: 'USD',
      createdAt: NOW,
      members: [{ userId: USER_ME, role: 'owner', joinedAt: NOW }],
      // Cashew-style dark theme by default (toggle in Settings).
      darkMode: true,
    },
  ],

  accounts: [
    { id: ACC_CHECKING, spaceId: SPACE_ID, name: 'Main Checking', type: 'checking', startingBalance: 0, currency: 'USD', color: '#4DABF7', icon: 'card', createdAt: NOW },
    { id: ACC_CASH, spaceId: SPACE_ID, name: 'Cash', type: 'cash', startingBalance: 0, currency: 'USD', color: '#82C91E', icon: 'cash', createdAt: NOW },
    { id: ACC_SAVINGS, spaceId: SPACE_ID, name: 'Savings', type: 'savings', startingBalance: 0, currency: 'USD', color: '#7C5CFC', icon: 'wallet', createdAt: NOW },
  ],

  // --- Categories: sub-categories roll up into group-categories -------------
  // Default categories (no budget limits — the user sets those).
  groupCategories: [
    { id: 'grp_food', spaceId: SPACE_ID, name: 'Food & Drink', icon: 'restaurant', color: '#FF6B6B', kind: 'expense', order: 0, createdAt: NOW },
    { id: 'grp_transport', spaceId: SPACE_ID, name: 'Transport', icon: 'car', color: '#4DABF7', kind: 'expense', order: 1, createdAt: NOW },
    { id: 'grp_home', spaceId: SPACE_ID, name: 'Home', icon: 'home', color: '#7C5CFC', kind: 'expense', order: 2, createdAt: NOW },
    { id: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Lifestyle', icon: 'sparkles', color: '#F783AC', kind: 'expense', order: 3, createdAt: NOW },
    { id: 'grp_income', spaceId: SPACE_ID, name: 'Income', icon: 'cash', color: '#34C77B', kind: 'income', order: 4, createdAt: NOW },
  ],

  subCategories: [
    { id: 'sub_groceries', groupId: 'grp_food', spaceId: SPACE_ID, name: 'Groceries', icon: 'cart', createdAt: NOW },
    { id: 'sub_dining', groupId: 'grp_food', spaceId: SPACE_ID, name: 'Dining out', icon: 'restaurant', createdAt: NOW },
    { id: 'sub_coffee', groupId: 'grp_food', spaceId: SPACE_ID, name: 'Coffee', icon: 'cafe', createdAt: NOW },

    { id: 'sub_fuel', groupId: 'grp_transport', spaceId: SPACE_ID, name: 'Fuel', icon: 'car-sport', createdAt: NOW },
    { id: 'sub_transit', groupId: 'grp_transport', spaceId: SPACE_ID, name: 'Transit', icon: 'bus', createdAt: NOW },

    { id: 'sub_rent', groupId: 'grp_home', spaceId: SPACE_ID, name: 'Rent', icon: 'home', createdAt: NOW },
    { id: 'sub_utilities', groupId: 'grp_home', spaceId: SPACE_ID, name: 'Utilities', icon: 'flash', createdAt: NOW },
    { id: 'sub_maintenance', groupId: 'grp_home', spaceId: SPACE_ID, name: 'Maintenance', icon: 'hammer', createdAt: NOW },

    { id: 'sub_fun', groupId: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Entertainment', icon: 'game-controller', createdAt: NOW },
    { id: 'sub_shopping', groupId: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Shopping', icon: 'bag-handle', createdAt: NOW },
    { id: 'sub_health', groupId: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Health', icon: 'medkit', createdAt: NOW },

    { id: 'sub_salary', groupId: 'grp_income', spaceId: SPACE_ID, name: 'Salary', icon: 'cash', createdAt: NOW },
    { id: 'sub_other_income', groupId: 'grp_income', spaceId: SPACE_ID, name: 'Other income', icon: 'add-circle', createdAt: NOW },
  ],

  // No history — the user creates goals and logs transactions.
  transactions: [],
  goals: [],
  contributions: [],
};
