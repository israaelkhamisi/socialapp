export interface Notification {
  _id: string;
  actor: {
    _id: string;
    name: string;
    photo: string;
  };
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: {
    _id: string;
    name?: string;
    body?: string;
  };
}