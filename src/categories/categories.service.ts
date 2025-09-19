import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category already exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
      .loadRelationCountAndMap('category.productCount', 'category.products')
      .getMany();
  }

  async findAllWithQuery(query: QueryCategoryDto): Promise<{ categories: Category[]; total: number }> {
    const { page, limit, search, sortBy, sortOrder, minProducts, maxProducts } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.categoriesRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.products', 'product')
        .loadRelationCountAndMap('category.productCount', 'category.products');

    // Search filter
    if (search) {
        queryBuilder.where(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` }
        );
    }

    // Product count filters
    if (minProducts !== undefined || maxProducts !== undefined) {
        queryBuilder.having('COUNT(product.id) >= :minProducts', { minProducts: minProducts || 0 });
        
        if (maxProducts !== undefined) {
        queryBuilder.andHaving('COUNT(product.id) <= :maxProducts', { maxProducts });
        }
    }

    // Sorting
    if (sortBy) {
        const order = sortOrder.toUpperCase() as 'ASC' | 'DESC';
        queryBuilder.orderBy(`category.${sortBy}`, order);
    }

    // Pagination
    queryBuilder.skip(skip).take(limit);

    const [categories, total] = await queryBuilder.getManyAndCount();

    return { categories, total };
    }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.products', 'product')
      .loadRelationCountAndMap('category.productCount', 'category.products')
      .where('category.id = :id', { id })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      // Check if new name already exists
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.products && category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with associated products');
    }

    await this.categoriesRepository.remove(category);
  }
}