import { Test, TestingModule } from '@nestjs/testing';
import { SupportService } from './support.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { SupportFilter } from './dto/support.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppMessage } from '../../app/utils/messages.enum';

describe('SupportService', () => {
  let supportService: SupportService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportService, PrismaService],
    }).compile();

    supportService = module.get<SupportService>(SupportService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a support entry', async () => {
      const createSupportDto = {
        uid: '+8801861270100',
        name: 'Albert Ojo-Aromokudu',
        title: 'test title',
        description: 'test description',
      };

      // Mock the PrismaService method to return a value
      prismaService.support.create = jest
        .fn()
        .mockResolvedValue(createSupportDto);

      const expectedResult = {
        uid: '+8801861270100',
        name: 'Albert Ojo-Aromokudu',
        title: 'test title',
        description: 'test description',
      };

      const result = await supportService.create(createSupportDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should find all support entries', async () => {
      const filterQuery: SupportFilter = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'desc',
      };

      const supportItem = [
        {
          id: '64d4f4a532dca390fcc3a15c',
          uid: '27766251132',
          name: 'Albert Ojo-Aromokudu',
          title: 'Help',
          description: '',
          caseClosed: true,
          isDelete: false,
          createdAt: new Date('2023-08-10T14:30:59.811Z'),
          updatedAt: new Date('2023-08-10T14:30:59.811Z'),
        },
      ];

      const expectedResult = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        allData: supportItem,
      };

      // Mock the PrismaService method to return a value
      jest
        .spyOn(prismaService.support, 'findMany')
        .mockResolvedValue(supportItem);

      const result = await supportService.findAll(filterQuery);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find a support entry by ID', async () => {
      const supportId = '64d4f4a532dca390fcc3a15c'; // Replace with a valid ID

      const chatItems = [
        {
          id: '64d4f4a732dca390fcc3a15d',
          support_id: '64d4f4a532dca390fcc3a15c',
          message: 'Help',
          sender: '27766251132',
          sender_name: 'Albert Ojo-Aromokudu',
          createdAt: '2023-08-10T14:31:03.163Z',
          updatedAt: '2023-08-10T14:31:03.163Z',
        },
      ];

      const expectedResult = {
        id: '64d4f4a532dca390fcc3a15c',
        uid: '27766251132',
        name: 'Albert Ojo-Aromokudu',
        title: 'Help',
        description: '',
        caseClosed: true,
        isDelete: false,
        createdAt: new Date('2023-08-10T14:30:59.811Z'),
        updatedAt: new Date('2023-08-10T14:30:59.811Z'),
        chat: chatItems,
      }; // Define your expected result

      // Mock the PrismaService method to return a value
      jest
        .spyOn(prismaService.support, 'findFirst')
        .mockResolvedValue(expectedResult);

      const result = await supportService.findOne(supportId);

      expect(result).toEqual(expectedResult);
    });

    it('should handle not found scenario', async () => {
      const supportId = '333'; // Use a non-existing ID

      // Mock the PrismaService method to return null
      jest.spyOn(prismaService.support, 'findFirst').mockResolvedValue(null);

      try {
        await supportService.findOne(supportId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response.message).toBe(AppMessage.NOT_FOUND);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('update', () => {
    it('should update a support entry by ID', async () => {
      const supportId = '64d4f4a532dca390fcc3a15c'; // Replace with a valid ID
      const updateSupportDto: UpdateSupportDto = {
        name: 'Albert Ojo-Aromokudu',
      };

      const expectedResult = {
        ...updateSupportDto,
        id: supportId,
      }; // Define your expected result

      prismaService.support.findFirst = jest
        .fn()
        .mockResolvedValue({ id: supportId });
      prismaService.support.update = jest.fn().mockResolvedValue({
        ...updateSupportDto,
        id: supportId,
      });

      // Act
      const result = await supportService.update(supportId, updateSupportDto);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should handle not found scenario during update', async () => {
      const supportId = '333'; // Use a non-existing ID
      const updateSupportDto: UpdateSupportDto = {
        name: 'Albert Ojo-Aromokudu',
      };

      // Mock the PrismaService method to return null
      jest.spyOn(prismaService.support, 'findFirst').mockResolvedValue(null);

      try {
        await supportService.update(supportId, updateSupportDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBeDefined(); // Ensure the response property exists
        expect(error.message).toBe(AppMessage.NOT_FOUND);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('remove', () => {
    it('should remove a support entry by ID', async () => {
      const supportId = '164d4f4a532dca390fcc3a15c23'; // Replace with a valid ID

      prismaService.support.findFirst = jest
        .fn()
        .mockResolvedValue({ id: supportId });
      prismaService.chat.deleteMany = jest
        .fn()
        .mockResolvedValue({ support_id: supportId });
      prismaService.support.delete = jest
        .fn()
        .mockResolvedValue({ id: supportId });

      const result = await supportService.remove(supportId);

      expect(result).toEqual({ id: supportId });
    });

    it('should handle not found scenario during removal', async () => {
      const supportId = '333'; // Use a non-existing ID

      // Mock the PrismaService method to return null
      jest.spyOn(prismaService.support, 'findFirst').mockResolvedValue(null);

      try {
        await supportService.remove(supportId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBeDefined(); // Ensure the response property exists
        expect(error.message).toBe(AppMessage.NOT_FOUND);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
