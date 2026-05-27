import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatsServices } from './stats.service';

const getStatsController = catchAsync(async (_req, res) => {
  const result = await StatsServices.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stats fetched successfully',
    data: result,
  });
});

export const StatsController = { getStatsController };
