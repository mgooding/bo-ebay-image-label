const imageInput = document.getElementById("image-input");
const labelInput = document.getElementById("label-input");
const downloadLink = document.getElementById("download-link");
const outputImage = document.getElementById("output-image");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

labelInput.value = `vert: 5 mA/div
hori: 5 v/ div
0.05 mA/ steps
`;

let originalImage;

function getScaledDimensions(width, height, maxWidth, maxHeight) {
  const aspectRatio = width / height;
  let newWidth = width;
  let newHeight = height;

  if (width > maxWidth) {
    newWidth = maxWidth;
    newHeight = newWidth / aspectRatio;
  }

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = newHeight * aspectRatio;
  }

  return { width: newWidth, height: newHeight };
}

function resizeImage(inputImage) {
  const { width, height } = getScaledDimensions(
    inputImage.width,
    inputImage.height,
    800,
    800
  );
  const resizedCanvas = createCanvas(width, height);
  const resizedCtx = resizedCanvas.getContext("2d");
  resizedCtx.drawImage(inputImage, 0, 0, width, height);
  const outputImage = new Image();
  outputImage.src = resizedCanvas.toDataURL("image/jpeg");
  return outputImage;
}

function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

imageInput.addEventListener("change", () => {
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawImage = new Image();
      rawImage.src = e.target.result;
      rawImage.onload = () => {
        originalImage = resizeImage(rawImage);
        inputChanged = true;
      };
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
});

async function updateImage() {
  const labelText = labelInput.value.trim();

  if (originalImage) {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
  }

  drawLabelOnCanvas(labelText);
  updateDownloadLink();
  displayOutputImage();
}

function drawLabelOnCanvas(labelText) {
  const lines = labelText.split(/\r?\n/);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  const maxWidth = canvas.width - 20;
  const lineHeight = 25;

  const totalTextHeight = lines.length * lineHeight;
  let y = canvas.height - totalTextHeight;

  for (const textLine of lines) {
    y = drawLineOfText(textLine, maxWidth, lineHeight, y);
  }
}

function drawLineOfText(textLine, maxWidth, lineHeight, y) {
  const words = textLine.split(" ");
  let line = "";

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth) {
      drawText(line, 10, y);
      line = word + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  drawText(line, 10, y);
  return y + lineHeight;
}

function drawText(text, x, y) {
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function updateDownloadLink() {
  const dataURL = canvas.toDataURL("image/jpeg");
  downloadLink.href = dataURL;
  downloadLink.hidden = false;
}

function displayOutputImage() {
  const scaledDims = getScaledDimensions(
    originalImage.width,
    originalImage.height,
    window.innerWidth * 0.45,
    window.innerHeight * 0.45
  );

  outputImage.width = scaledDims.width;
  outputImage.height = scaledDims.height;
  outputImage.src = canvas.toDataURL("image/jpeg");
  outputImage.hidden = false;
}

let inputChanged = false;

imageInput.addEventListener("input", () => {
  inputChanged = true;
});

labelInput.addEventListener("input", () => {
  inputChanged = true;
});

window.addEventListener("resize", () => {
  inputChanged = true;
});

setInterval(async () => {
  if (inputChanged) {
    await updateImage();
    inputChanged = false;
  }
}, 1000);
