import { useContext } from 'react';

import { BudgetContext, type SubCategoryEdit } from '@/context/BudgetContext';
import {
  getGroupCategory as getGroupCategoryPure,
  getGroupForSub as getGroupForSubPure,
  getSubCategory as getSubCategoryPure,
  getSubsForGroup as getSubsForGroupPure,
  resolveSubVisual as resolveSubVisualPure,
} from '@/lib/categories';
import { newId } from '@/lib/id';
import type { GroupCategory, SubCategory } from '@/models';

export interface NewSubCategoryInput {
  groupId: string;
  name: string;
  icon: string;
  color: string;
}

export interface NewGroupCategoryInput {
  name: string;
  icon: string;
  color: string;
  kind?: GroupCategory['kind'];
  budgetLimit?: number;
}

/**
 * Categories bound to app state, so custom user-created categories resolve
 * everywhere. Throws if used outside <BudgetProvider>.
 */
export function useCategories() {
  const ctx = useContext(BudgetContext);
  if (!ctx) {
    throw new Error('useCategories must be used within a <BudgetProvider>');
  }
  const { state, dispatch } = ctx;
  const { groupCategories, subCategories } = state;

  const addSubCategory = (input: NewSubCategoryInput): SubCategory => {
    const sub: SubCategory = {
      id: newId(),
      groupId: input.groupId,
      spaceId: state.currentSpaceId,
      name: input.name.trim(),
      icon: input.icon,
      color: input.color,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SUBCATEGORY', payload: sub });
    return sub;
  };

  const editSubCategory = (id: string, changes: SubCategoryEdit) =>
    dispatch({ type: 'EDIT_SUBCATEGORY', payload: { id, changes } });

  const deleteSubCategory = (id: string) =>
    dispatch({ type: 'DELETE_SUBCATEGORY', payload: { id } });

  const addGroupCategory = (input: NewGroupCategoryInput): GroupCategory => {
    const group: GroupCategory = {
      id: newId(),
      spaceId: state.currentSpaceId,
      name: input.name.trim(),
      icon: input.icon,
      color: input.color,
      kind: input.kind ?? 'expense',
      budgetLimit: input.budgetLimit,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GROUP_CATEGORY', payload: group });
    return group;
  };

  return {
    groupCategories,
    subCategories,
    getGroupCategory: (id: string) => getGroupCategoryPure(groupCategories, id),
    getSubCategory: (id: string) => getSubCategoryPure(subCategories, id),
    getGroupForSub: (subId: string) => getGroupForSubPure(groupCategories, subCategories, subId),
    getSubsForGroup: (groupId: string) => getSubsForGroupPure(subCategories, groupId),
    resolveSubVisual: (subId: string) =>
      resolveSubVisualPure(groupCategories, subCategories, subId),
    addSubCategory,
    editSubCategory,
    deleteSubCategory,
    addGroupCategory,
  };
}
