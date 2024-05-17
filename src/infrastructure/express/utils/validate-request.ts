import { ValidationError, validate } from "class-validator";
import {ClassConstructor, plainToClass}  from "class-transformer"

// Pour valider des requests entrants
const validationError = async (input: any) : Promise <ValidationError[] | false> => {
  const errors = await validate(input, { validationError: {target: true}})
 if (errors.length) {
  return errors
 }

 return false
}

/**
 * Hàm này thực hiện việc xác thực đối tượng đầu vào dựa trên các quy tắc đã định sẵn
 * và trả về một đối tượng chứa thông tin về các lỗi (nếu có) và đối tượng đầu vào.
 * @param type: ClassConstructor<T> đại diện cho kiểu dữ liệu của đối tượng đầu vào cần biến đổi và xác thực
 * @param body: any - Dữ liệu đầu vào cần được xác thực
 * @returns Promise<{errors: boolean | string; input: T}> - Một Promise chứa thông tin về các lỗi (nếu có) và đối tượng đầu vào.
 */

// Vì Sao dùng ClassConstructor<T>
// ClassConstructor<T> cho phép chúng ta sử dụng hàm RequestValidator với bất kỳ loại dữ liệu nào, không chỉ giới hạn trong trường hợp cụ thể của CreateConferenceInputs.

export const RequestValidator = async <T>(type: ClassConstructor<T>, body: any): Promise<{ errors: boolean | string; input: T }> => {
  // plainToClass(type, body) là một phương thức từ thư viện class-transformer, được sử dụng để chuyển đổi dữ liệu từ dạng plain object sang đối tượng của lớp đã định sẵn. 
  const input = plainToClass(type, body);

  // Kiểm tra xem đối tượng có hợp lệ hay không bằng cách sử dụng hàm validationError
  const errors = await validationError(input);

  if (errors) {
    const errorMessages = errors.map(error => (Object as any).values(error.constraints)).join(', ');

    return { errors: errorMessages, input };
  }

  return { errors: false, input };
}

