export const checkImage = (file: File) => {
   let err = '';
   if (!file) return err = 'File does not exist!'

   if (file.size > 1024 * 1024) //1mb {}
      err = 'The largest file size is 1MB!'

   if (file.type !== 'image/jpeg' && file.type !== 'image/png')
      err = 'Image format is incorect!'

   return err;
}

export const imageUpload = async (file: File) => {
   const formData = new FormData();
   formData.append('file', file);
   formData.append('upload_preset', 'wi5uwxua');
   formData.append('cloud_name', 'noze-blog')

   const res = await fetch('https://api.cloudinary.com/v1_1/noze-blog/upload', {
      method: 'POST',
      body: formData
   })
   const data = await res.json();
   return {
      public_id: data.public_id,
      url: data.url
   };
}