import validator from "validator";

export const validateRegister = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName) {
    throw new Error("firstName is required.");
  }

  if (!lastName) throw new Error("lastName is required");

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    throw new Error("Password must be at least 6 characters.");
  }
};

export const validateLogin = (req)=>{
  const {email , password} = req.body;
  if(!email || !validator.isEmail(email)){
    throw new Error("Invalid email format.");
  }
  if(!password) throw new Error("Invalid Password");
};

export const validateBlog=(req)=>{
  const {title , content , image , category } = req.body;
  if(!title) throw new Error("title is required");
  if(!content) throw new Error("content is required");
};
