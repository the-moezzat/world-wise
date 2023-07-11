import { useSearchParams } from 'react-router-dom';

export function useUrlPosition() {
  const [searchParam] = useSearchParams();
  return [searchParam.get('lat'), searchParam.get('lng')];
}
