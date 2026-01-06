import { RootTabParamList } from '../types/navigation';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
