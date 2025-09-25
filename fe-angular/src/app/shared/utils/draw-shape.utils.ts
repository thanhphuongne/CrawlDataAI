import Konva from 'konva';

export function zoomStageCenterImage(
  stage: Konva.Stage,
  image: Konva.Image
): number {
  const ratioX = image.width() / stage.width();
  const ratioY = image.height() / stage.height();
  let scaleFactor: number;

  if (ratioX > ratioY) {
    scaleFactor = stage.width() / image.width();
  } else {
    scaleFactor = stage.height() / image.height();
  }
  stage.scale({ x: scaleFactor, y: scaleFactor });
  return scaleFactor;
}
