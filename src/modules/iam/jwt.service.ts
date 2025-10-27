import jwt from 'jsonwebtoken';

const sign = (payload: string | Buffer | object, secretOrPrivateKey: jwt.Secret, options: jwt.SignOptions) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options, (err, encoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encoded);
    });
  });
};

const verify = <T>(token: string, secretOrPrivateKey: jwt.Secret) => {
  return jwt.verify(token, secretOrPrivateKey) as T;
};

export default {
  sign,
  verify,
};
