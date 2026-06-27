import type { BudgetData } from '@/models';

/**
 * Initial dataset used on first launch (before anything is persisted).
 * Models a single household Space shared by two members.
 */

export const SPACE_ID = 'space_home';
export const USER_ME = 'user_me';
export const USER_PARTNER = 'user_partner';

const ACC_CHECKING = 'acc_checking';
const ACC_CASH = 'acc_cash';
const ACC_SAVINGS = 'acc_savings';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const EPOCH = daysAgo(365);

export const SEED_DATA: BudgetData = {
  currentUserId: USER_ME,
  currentSpaceId: SPACE_ID,

  users: [
    { id: USER_ME, name: 'You', email: 'you@example.com', color: '#7C5CFC', createdAt: EPOCH },
    { id: USER_PARTNER, name: 'Alex', email: 'alex@example.com', color: '#34C77B', createdAt: EPOCH },
  ],

  spaces: [
    {
      id: SPACE_ID,
      name: 'Household',
      ownerId: USER_ME,
      currency: 'USD',
      createdAt: EPOCH,
      members: [
        { userId: USER_ME, role: 'owner', joinedAt: EPOCH },
        { userId: USER_PARTNER, role: 'editor', joinedAt: EPOCH },
      ],
    },
  ],

  accounts: [
    { id: ACC_CHECKING, spaceId: SPACE_ID, name: 'Main Checking', type: 'checking', startingBalance: 2400, currency: 'USD', color: '#4DABF7', icon: 'card', createdAt: EPOCH },
    { id: ACC_CASH, spaceId: SPACE_ID, name: 'Cash', type: 'cash', startingBalance: 180, currency: 'USD', color: '#82C91E', icon: 'cash', createdAt: EPOCH },
    { id: ACC_SAVINGS, spaceId: SPACE_ID, name: 'Savings', type: 'savings', startingBalance: 6000, currency: 'USD', color: '#7C5CFC', icon: 'wallet', createdAt: EPOCH },
  ],

  // --- Categories: sub-categories roll up into group-categories -------------
  groupCategories: [
    { id: 'grp_food', spaceId: SPACE_ID, name: 'Food & Drink', icon: 'restaurant', color: '#FF6B6B', kind: 'expense', budgetLimit: 600, order: 0, createdAt: EPOCH },
    { id: 'grp_transport', spaceId: SPACE_ID, name: 'Transport', icon: 'car', color: '#4DABF7', kind: 'expense', budgetLimit: 250, order: 1, createdAt: EPOCH },
    { id: 'grp_home', spaceId: SPACE_ID, name: 'Home', icon: 'home', color: '#7C5CFC', kind: 'expense', budgetLimit: 1600, order: 2, createdAt: EPOCH },
    { id: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Lifestyle', icon: 'sparkles', color: '#F783AC', kind: 'expense', budgetLimit: 350, order: 3, createdAt: EPOCH },
    { id: 'grp_income', spaceId: SPACE_ID, name: 'Income', icon: 'cash', color: '#34C77B', kind: 'income', order: 4, createdAt: EPOCH },
  ],

  subCategories: [
    { id: 'sub_groceries', groupId: 'grp_food', spaceId: SPACE_ID, name: 'Groceries', icon: 'cart', createdAt: EPOCH },
    { id: 'sub_dining', groupId: 'grp_food', spaceId: SPACE_ID, name: 'Dining out', icon: 'restaurant', createdAt: EPOCH },
    { id: 'sub_coffee', groupId: 'grp_food', spaceId: SPACE_ID, name: 'Coffee', icon: 'cafe', createdAt: EPOCH },

    { id: 'sub_fuel', groupId: 'grp_transport', spaceId: SPACE_ID, name: 'Fuel', icon: 'car-sport', createdAt: EPOCH },
    { id: 'sub_transit', groupId: 'grp_transport', spaceId: SPACE_ID, name: 'Transit', icon: 'bus', createdAt: EPOCH },

    { id: 'sub_rent', groupId: 'grp_home', spaceId: SPACE_ID, name: 'Rent', icon: 'home', createdAt: EPOCH },
    { id: 'sub_utilities', groupId: 'grp_home', spaceId: SPACE_ID, name: 'Utilities', icon: 'flash', createdAt: EPOCH },
    { id: 'sub_maintenance', groupId: 'grp_home', spaceId: SPACE_ID, name: 'Maintenance', icon: 'hammer', createdAt: EPOCH },

    { id: 'sub_fun', groupId: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Entertainment', icon: 'game-controller', createdAt: EPOCH },
    { id: 'sub_shopping', groupId: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Shopping', icon: 'bag-handle', createdAt: EPOCH },
    { id: 'sub_health', groupId: 'grp_lifestyle', spaceId: SPACE_ID, name: 'Health', icon: 'medkit', createdAt: EPOCH },

    { id: 'sub_salary', groupId: 'grp_income', spaceId: SPACE_ID, name: 'Salary', icon: 'cash', createdAt: EPOCH },
    { id: 'sub_other_income', groupId: 'grp_income', spaceId: SPACE_ID, name: 'Other income', icon: 'add-circle', createdAt: EPOCH },
  ],

  transactions: [
    { id: 't1', spaceId: SPACE_ID, accountId: ACC_CHECKING, subCategoryId: 'sub_groceries', type: 'expense', amount: 64.2, note: 'Weekly shop', date: daysAgo(0), createdBy: USER_ME, createdAt: daysAgo(0) },
    { id: 't2', spaceId: SPACE_ID, accountId: ACC_CASH, subCategoryId: 'sub_dining', type: 'expense', amount: 12.5, note: 'Lunch', date: daysAgo(0), createdBy: USER_PARTNER, createdAt: daysAgo(0) },
    { id: 't3', spaceId: SPACE_ID, accountId: ACC_CHECKING, subCategoryId: 'sub_fuel', type: 'expense', amount: 30, note: 'Fuel', date: daysAgo(1), createdBy: USER_ME, createdAt: daysAgo(1) },
    { id: 't4', spaceId: SPACE_ID, accountId: ACC_CHECKING, subCategoryId: 'sub_salary', type: 'income', amount: 1800, note: 'Salary', date: daysAgo(2), createdBy: USER_ME, createdAt: daysAgo(2) },
    { id: 't5', spaceId: SPACE_ID, accountId: ACC_CASH, subCategoryId: 'sub_fun', type: 'expense', amount: 22, note: 'Cinema', date: daysAgo(2), createdBy: USER_PARTNER, createdAt: daysAgo(2) },
    { id: 't6', spaceId: SPACE_ID, accountId: ACC_CHECKING, subCategoryId: 'sub_utilities', type: 'expense', amount: 120, note: 'Electricity', date: daysAgo(4), createdBy: USER_ME, createdAt: daysAgo(4) },
    { id: 't7', spaceId: SPACE_ID, accountId: ACC_CHECKING, subCategoryId: 'sub_coffee', type: 'expense', amount: 4.8, note: 'Flat white', date: daysAgo(1), createdBy: USER_ME, createdAt: daysAgo(1) },
  ],

  goals: [
    { id: 'goal_vacation', spaceId: SPACE_ID, name: 'Vacation Fund', targetAmount: 3000, currentAmount: 750, accountId: ACC_SAVINGS, targetDate: daysAgo(-120), color: '#22B8CF', icon: 'airplane', status: 'active', createdAt: EPOCH },
    { id: 'goal_emergency', spaceId: SPACE_ID, name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1800, accountId: ACC_SAVINGS, color: '#7C5CFC', icon: 'shield-checkmark', status: 'active', createdAt: EPOCH },
    { id: 'goal_laptop', spaceId: SPACE_ID, name: 'New Laptop', targetAmount: 2000, currentAmount: 2000, accountId: ACC_SAVINGS, color: '#FFA94D', icon: 'laptop', status: 'reached', createdAt: EPOCH },
  ],
};
