
export function determine_action(minX, minY, maxX, maxY)
{
  var position = (minX+maxX)/2;
  if(position < 100){
    position = 0;
  }else if(position > 500)
  {
    position = 1;
  }else{
    position = (position-100)/400
  }
  stack_actions.push(position);

  if(minY<0.9*average_y_calibrated){
    stack_jumps.push(true);
  }else{
    stack_jumps.push(false);
  }
}

export function calibrate(minX, minY, maxX, maxY)
{
  return minY;
}