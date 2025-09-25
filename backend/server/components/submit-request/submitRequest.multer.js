import path from 'path';
import multer from 'multer';
import slug from 'limax';
import APIError from '../../util/APIError';
import {
  MAX_UPLOAD_FILE_SIZE_MB,
  MEGABYTE,
  UPLOADS_DESTINATION,
  ROOT_PATH,
} from '../../constants';
import { getCurrentDateString } from '../../helpers/string.helper';
import { mkDir } from '../../helpers/file.helper';

function getUserProfileMulter() {
  const storageUserProfile = multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = `${ROOT_PATH}/${UPLOADS_DESTINATION}/${getCurrentDateString()}/user-profile/${req.auth._id}`;
      mkDir(dest);
      cb(null, dest);
    },
    filename: async function (req, file, cb) {
      const originalName = file.originalname;
      const fieldName = file.fieldname;
      const fileExtension = path.extname(originalName) || '';
      const slugName = slug(path.basename(file.originalname, fileExtension), { lowercase: true });
      const finalName = `${fieldName}-${slugName}-${Date.now()}${fileExtension}`;
      cb(null, finalName);
    }
  });

  const limits = { fileSize: MAX_UPLOAD_FILE_SIZE_MB * MEGABYTE };
  const fileAllowedFormats = ['jpg', 'jpeg', 'png'];

  const userProfileMulter = multer({
    storage: storageUserProfile,
    limits: limits,
    fileFilter: function (req, file, cb) {
      const originalName = file.originalname.toLowerCase();
      if (!originalName.match(new RegExp(`\.(${fileAllowedFormats.join('|')})$`))) {
        return cb(new APIError(422, [{
          msg: `User identity format must be ${fileAllowedFormats.join(', ')} and max size: ${MAX_UPLOAD_FILE_SIZE_MB}MB!`,
          param: 'userIdentityInvalid',
          location: 'body',
        }]));
      }
      return cb(null, true);
    },
  });

  return userProfileMulter.fields([
    { name: 'identityCardFront', maxCount: 1 },
    { name: 'identityCardBack', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]);
}

export const userProfileUploader = getUserProfileMulter();
