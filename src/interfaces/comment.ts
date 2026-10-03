export interface Comment {
    success: boolean;
    message: string;
    data:    Data;
    meta:    Meta;
}
export interface CommentItem {
  _id: string;
  content: string;
  createdAt: string;
  post: string;
  parentComment: string | null;
  repliesCount: number;
  likes: string[];
   image?: string;
  commentCreator: {
    _id: string;
    name: string;
    username: string;
    photo: string;
   
  };
}
export interface Data {
    comments: CommentItem[];
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    currentPage:   number;
    limit:         number;
    total:         number;
    numberOfPages: number;
}


