import { Entry } from './entry';

export type RootTabParamList = {
  Records: undefined;
  Projects: undefined;
  Overview: undefined;
  Reports: undefined;
  Timeline: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RecordsStackParamList = {
  RecordsList: undefined;
  EntryDetail: { entryId: string };
  EntryEdit: { entryId?: string };
};

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetail: { projectId: string };
  ProjectEdit: { projectId?: string };
};
