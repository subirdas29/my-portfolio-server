import QueryBuilder from "../../builder/QueryBuilder";
import { TSkill } from "./skill.interface";
import { Skill } from "./skill.model";



const createSkill = async (payload: TSkill) => {

  const result = await Skill.create(payload);
  return result;
};


const getAllSkill = async (query: Record<string, unknown>) => {
  const projectQuery = new QueryBuilder(Skill.find(), query);

  const result = await projectQuery.modelQuery;
    const meta = await projectQuery.countTotal();
    
    return {
        result,
        meta
    }
  }

  const getdeleteSkill = async (
    id: string,
    // token:JwtPayload
  ) => {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
  
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not delete this blog, Because you are not author this blog")
    //   }
  
    const result = await Skill.findByIdAndDelete(id);
    return result;
  };
  

export const SkillServices = {
    createSkill,
    getAllSkill,
    getdeleteSkill
  };
  