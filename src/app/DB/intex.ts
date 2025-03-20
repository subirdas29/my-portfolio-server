import config from "../config"
import { User } from "../modules/auth/auth.model"


const superUser = {
  email: 'subirdas1045@gmail.com',
  password: config.admin_password,
  role: 'admin'
}


const seedAdmin = async()=>{

    //when database is connected, we will check is there any user who is super admin

    const isAdminExist = await User.findOne({role:'admin'})
    
    if(!isAdminExist){
        await User.create(superUser) // eta er  call sob somoy database connection er time e auto hbe
    }
}

export default seedAdmin