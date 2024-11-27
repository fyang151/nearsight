const context = require.context("./", false, /\.png$/);

const images = {};
context.keys().forEach((file) => {
  const key = file.replace("./", "").replace(".png", "");
  images[key] = context(file);
});

export default images;