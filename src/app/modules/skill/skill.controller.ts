import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SkillServices } from "./skill.service";
import { CacheUtils } from "../../utils/CacheUtils";

const createSkillController = catchAsync(async (req, res) => {
    const result = await SkillServices.createSkill(req.body);
    
  
    await CacheUtils.clearCache(['/api/v1/skills*']);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Skill is created successfully',
      data: result,
    });
});

const getAllSkill = catchAsync(async (req, res) => {
    const result = await SkillServices.getAllSkill(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Skills fetched successfully',
      meta: result.meta,
      data: result.result,
    });
});

const updateSkillOrderController = catchAsync(async (req, res) => {
  const result = await SkillServices.updateSkillOrder(req.body);

  
  await CacheUtils.clearCache(['/api/v1/skills*']);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Skill order updated successfully',
    data: result,
  });
});
 
const deleteOwnSkillController = catchAsync(async (req, res) => {
    const { id } = req.params;
    await SkillServices.getdeleteSkill(id);
  
 
    await CacheUtils.clearCache(['/api/v1/skills*']);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Skill deleted successfully',
        data: null
    });
});

export const SkillController = {
    createSkillController,
    getAllSkill,
    updateSkillOrderController,
    deleteOwnSkillController
};