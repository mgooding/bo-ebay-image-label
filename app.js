const imageInput = document.getElementById('image-input');
const labelInput = document.getElementById('label-input');
const generateBtn = document.getElementById('generate-btn');
const downloadLink = document.getElementById('download-link');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

imageInput.addEventListener('change', () => {
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
});

generateBtn.addEventListener('click', async () => {
  const labelText = labelInput.value.trim();
  if (!labelText) {
    alert('Please enter some label text.');
    return;
  }
  
  // Draw the label text on the canvas
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  const maxWidth = canvas.width - 20;
  const lineHeight = 25;
  const words = labelText.split(' ');
  let line = '';
  let y = 30;

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth) {
      ctx.strokeText(line, 10, y);
      ctx.fillText(line, 10, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.strokeText(line, 10, y);
  ctx.fillText(line, 10, y);

  // Convert the canvas to a JPG
  const dataURL = canvas.toDataURL('image/jpeg');
  downloadLink.href = dataURL;
  downloadLink.hidden = false;
});
    

