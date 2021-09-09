import { useRef } from 'react';
import { BaseGesture } from './gesture';

export default function useGesture<Type extends BaseGesture<any>>(
  gesture: Type
): Type {
  const result = useRef(gesture);
  return result.current;
}
