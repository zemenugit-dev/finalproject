import { findAllCategories, createCategoryData } from './categories.repository';

export const getAllCategoriesService = async () => {
    const categories = await findAllCategories();
    return categories;
};

export const createCategoryService = async (name: string, description: string) => {
    if (!name) {
        throw new Error('Category name is required');
    }
    const newCategory = await createCategoryData(name, description);
    return newCategory;
};
