import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SkillServices } from "./skill.service";


const createSkillController = catchAsync(async (req, res) => {
    const result = await SkillServices.createSkill(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Skill is created successfully',
      data: result,
    });
  });

  const  getAllSkill = catchAsync(async (req, res) => {
    const result = await SkillServices.getAllSkill(req.query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Skills fetched successfully',
      meta:result.meta,
      data: result.result,
    });
  });
const updateSkillOrderController = catchAsync(async (req, res) => {

  const result = await SkillServices.updateSkillOrder(req.body);

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
  
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Skill deleted successfully',
      statusCode: httpStatus.OK,
    });
  });
  


  export const SkillController = {
    createSkillController,
    getAllSkill,
    updateSkillOrderController,
    deleteOwnSkillController
  };