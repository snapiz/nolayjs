import jwt from 'jsonwebtoken';

export function createLoginResponse(user, { passport: { secret, fields, expiresIn } }) {
  const token = jwt.sign({id: user.get("id")}, secret, { expiresIn });
  
  fields = fields.reduce((data, field) => {
    data[field] = user.get(field);
    return data;
  }, {});
  
  return {
    ...fields,
    token
  };
}