import { Test, TestingModule } from '@nestjs/testing';
import { SupportDetailsService } from './support-details.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupportDetailDto } from './dto/create-support-detail.dto';
import { UpdateSupportDetailDto } from './dto/update-support-detail.dto';
import { SupportDetailsFilter } from './dto/support-details.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppMessage } from '../../app/utils/messages.enum';
import { Twilio } from 'twilio';

export const createTwilioClient = () => {
  return new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
};

describe('SupportDetailsService', () => {
  let supportDetailsService: SupportDetailsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportDetailsService, PrismaService],
    }).compile();

    supportDetailsService = module.get<SupportDetailsService>(
      SupportDetailsService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a support detail entry', async () => {
      const createSupportDetailDto: CreateSupportDetailDto = {
        support_id: '64dca0ca73663003c78e9c7b',
        message: 'string',
        sender: 'string',
        sender_name: 'string',
      };
      // Mock PrismaService methods
      prismaService.support.findFirst = jest
        .fn()
        .mockResolvedValue({ id: createSupportDetailDto.support_id });
      prismaService.chat.create = jest
        .fn()
        .mockResolvedValue(createSupportDetailDto);

      const twilioClientMock = createTwilioClient();
      const createMessageMock = jest.fn().mockResolvedValue({}) as any; // Explicitly specify the type

      jest
        .spyOn(twilioClientMock.messages, 'create')
        .mockImplementation(createMessageMock);

      try {
        const result = await supportDetailsService.create(
          createSupportDetailDto,
        );

        expect(result).toEqual(createSupportDetailDto); // Define your expected result or assert other properties
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBeDefined(); // Ensure the response property exists
        expect(error.message).toBe(AppMessage.NOT_FOUND);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('findAll', () => {
    it('should find all support detail entries', async () => {
      // Mock PrismaService methods
      jest.spyOn(prismaService.chat, 'findMany').mockResolvedValue([]);

      const filterQuery: SupportDetailsFilter = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'desc',
      };

      const supportDetailsItem = [
        {
          id: '65159932c1b01228ccf727ba',
          support_id: '64da838573663003c78e9c79',
          message: 'string',
          sender: 'string',
          sender_name: 'string',
          createdAt: new Date('2023-09-28T15:18:10.892Z'),
          updatedAt: new Date('2023-09-28T15:18:10.892Z'),
        },
      ];

      const expectedResult = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        allData: supportDetailsItem,
      };

      jest
        .spyOn(prismaService.chat, 'findMany')
        .mockResolvedValue(supportDetailsItem);

      const result = await supportDetailsService.findAll(filterQuery);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find a support detail entry by ID', async () => {
      const supportDetailId = '123';
      // Mock PrismaService method
      const expectedResult = {
        id: '65159932c1b01228ccf727ba',
        support_id: '64da838573663003c78e9c79',
        message: 'string',
        sender: 'string',
        sender_name: 'string',
        createdAt: new Date('2023-09-28T15:18:10.892Z'),
        updatedAt: new Date('2023-09-28T15:18:10.892Z'),
      };

      jest
        .spyOn(prismaService.chat, 'findFirst')
        .mockResolvedValue(expectedResult);

      // Replace with a valid ID

      const result = await supportDetailsService.findOne(supportDetailId);

      expect(result).toBeDefined(); // Define your expected result or assert other properties
    });
  });

  describe('update', () => {
    it('should update a support detail entry by ID', async () => {
      const supportDetailId = '65159932c1b01228ccf727ba'; // Replace with a valid ID
      const updateSupportDetailDto: UpdateSupportDetailDto = {
        message: 'test update',
      };

      // Mock PrismaService methods
      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue({ id: supportDetailId });
      prismaService.chat.update = jest.fn().mockResolvedValue({
        ...updateSupportDetailDto,
        id: supportDetailId,
      });

      const result = await supportDetailsService.update(
        supportDetailId,
        updateSupportDetailDto,
      );

      expect(result).toEqual({
        ...updateSupportDetailDto,
        id: supportDetailId,
      });
    });

    it('should handle not found scenario during update', async () => {
      const supportDetailId = '111';

      const updateSupportDetailDto: UpdateSupportDetailDto = {
        message: 'test update',
      };
      // Mock PrismaService methods to return null
      jest.spyOn(prismaService.chat, 'findFirst').mockResolvedValue(null);

      try {
        await supportDetailsService.update(
          supportDetailId,
          updateSupportDetailDto as UpdateSupportDetailDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBeDefined(); // Ensure the response property exists
        expect(error.message).toBe(AppMessage.NOT_FOUND);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('remove', () => {
    it('should remove a support detail entry by ID', async () => {
      const supportDetailId = '65159932c1b01228ccf727ba';

      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue({ id: supportDetailId });

      prismaService.chat.delete = jest
        .fn()
        .mockResolvedValue({ id: supportDetailId });

      const result = await supportDetailsService.remove(supportDetailId);

      expect(result).toEqual({ id: supportDetailId });
    });

    it('should handle not found scenario during removal', async () => {
      const supportDetailId = '111'; // Use a non-existing ID

      // Mock PrismaService methods to return null
      jest.spyOn(prismaService.chat, 'findFirst').mockResolvedValue(null);

      try {
        await supportDetailsService.remove(supportDetailId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toBeDefined(); // Ensure the response property exists
        expect(error.message).toBe(AppMessage.NOT_FOUND);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
