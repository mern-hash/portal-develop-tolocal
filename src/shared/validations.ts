/**
 * @description Used for pattern validations (and prolly something else, we'll see)
 * @link https://github.com/weareneopix/certie-fe/blob/2e6ea2a/src/shared/validations.ts#L4
 */
const validateEmailPattern = /\S+@\S+\.\S+/;
const validateHexPattern = /^#([0-9a-f]{3}){1,2}$/i;
const validatePasswordPattern =
  /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
const validateUrlPattern =
  /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/g;

export {
  validateEmailPattern,
  validateHexPattern,
  validatePasswordPattern,
  validateUrlPattern,
};
