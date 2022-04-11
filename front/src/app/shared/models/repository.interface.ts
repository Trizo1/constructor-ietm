import { RepositoryType } from './repositoryTypeEnum';
import { ParticipantI } from './participant.interface';

export interface RepositoryI {
  _id: string;
  author: string;
  team?: string;
  title: string;
  type: RepositoryType;
  description: string;
  preview?: string;
  participants: ParticipantI[];
  // models: Model[];
}
