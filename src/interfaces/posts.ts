export interface Postsdata {
    success: boolean;
    message: string;
    data:    Data;
    meta:    Meta;
}

export interface Data {
    posts: Post[];
}

export  interface Post {
    _id:           string;
    body:          string;
    privacy:       Privacy;
    user:          User;
    sharedPost:     Post | null;
    likes:         string[];
    createdAt:     Date;
    commentsCount: number;
    topComment:    TopComment | null;
    sharesCount:   number;
    likesCount:    number;
    isShare:       boolean;
    id:            string;
    bookmarked:    boolean;
    image?:        string;
  

}

export enum Privacy {
    Public = "public",
}

export interface TopComment {
    _id:            string;
    content:        string;
    commentCreator: User;
    post:           string;
    parentComment:  null;
    likes:          any[];
    createdAt:      Date;
}

export interface User {
    _id:      string;
    name:     string;
    username: string;
    photo:    string;
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    currentPage:   number;
    numberOfPages: number;
    limit:         number;
    nextPage:      number;
    total:         number;
}
export type User1 ={
_id:'string',
name:'string',
username:'string',
email:'string',
photo:'string',
cover:'string'
followersCount?: number
followingCount?: number
bookmarks?: string[]
 }