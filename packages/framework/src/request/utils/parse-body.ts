/**
 * Copyright (c) 2019 Chan Zewail <chanzewail@gmail.com>
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import buddy from 'co-body'
import formidable from 'formidable'

function parseForm(req: any) {
  return new Promise(((resolve, reject) => {
    const fields: any = {};
    const files: any = {};
    const form = new formidable.IncomingForm();
    form.on('end', () => resolve({
      fields,
      files,
    })).on('error', (err: any) => reject(err)).on('field', (field: string, value: any) => {
      if (fields[field]) {
        if (Array.isArray(fields[field])) {
          fields[field].push(value);
        } else {
          fields[field] = [fields[field], value];
        }
      } else {
        fields[field] = value;
      }
    }).on('file', (field: string, file: any) => {
      if (files[field]) {
        if (Array.isArray(files[field])) {
          files[field].push(file);
        } else {
          files[field] = [files[field], file];
        }
      } else {
        files[field] = file;
      }
    });
    form.parse(req);
  }));
}

export async function parseBody(request: any) {
  let body: any = {};
  if (request.is('json')) {
    body.fields = await buddy.json(request.req);
  } else if (request.is('urlencoded')) {
    body.fields = await buddy.form(request.req);
  } else if (request.is('text')) {
    body.fields = await buddy.text(request.req);
  } else if (request.is('multipart')) {
    body = await parseForm(request.req);
  }
  return body;
};
