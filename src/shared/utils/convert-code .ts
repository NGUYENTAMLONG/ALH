export function convertCode(code: string) {
  code = code.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  code = code.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  code = code.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  code = code.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  code = code.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  code = code.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  code = code.replace(/đ/g, 'd');
  code = code.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  code = code.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  code = code.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  code = code.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  code = code.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  code = code.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  code = code.replace(/Đ/g, 'D');
  const convert = code.replace(/ /g, '_');
  return convert;
}
