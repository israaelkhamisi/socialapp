import { Avatar } from 'flowbite-react'
import type { Notification } from '../interfaces/Notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import { Link } from 'react-router'

dayjs.extend(relativeTime)

const typeInfo: Record<string, { text: string; icon: string; color: string }> = {
  follow_user: { text: 'followed you', icon: 'fa-solid fa-user-plus', color: 'text-purple-600' },
  comment_post: { text: 'commented on your post', icon: 'fa-regular fa-comment', color: 'text-blue-600' },
  like_post: { text: 'liked your post', icon: 'fa-regular fa-heart', color: 'text-rose-500' },
  share_post: { text: 'shared your post', icon: 'fa-solid fa-retweet', color: 'text-green-600' },
}

export default function Notifications() {
  const [fillter, setfillter] = useState('all')
  const queries = useQueryClient()

  // الإشعارات
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotification,
  })
  function getNotification() {
    return axios.get(
      `https://route-posts.routemisr.com/notifications?&page=1&limit=10`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
    )
  }
  const notifications: Notification[] = data?.data.data.notifications ?? []

  const shownNotifications =
  fillter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadNotification,
  })
  function getUnreadNotification() {
    return axios.get('https://route-posts.routemisr.com/notifications/unread-count', {
      headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` },
    })
  }
  const unreadcount: number = unreadData?.data.data.unreadCount ?? 0

  // Mark as read
  function markAsRead(id: string) {
    return axios.patch(
      `https://route-posts.routemisr.com/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
    )
  }
  const { mutate: handleisread } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queries.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
  function markAllAsRead() {
  return axios.patch(
    'https://route-posts.routemisr.com/notifications/read-all',
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('usertoken')}` } }
  )
}
const { mutate: handleReadAll } = useMutation({
  mutationFn: markAllAsRead,
  onSuccess: () => {
    queries.invalidateQueries({ queryKey: ['notifications'] })
  },
})

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <title>Notifications</title>
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
    
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Notifications</h1>
              <p className="mt-1 text-gray-500">Realtime updates for likes, comments, shares, and follows.</p>
            </div>
            <button
             onClick={() => handleReadAll()}
               disabled={unreadcount === 0}
             className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-100">
              <i className="fa-solid fa-check-double"></i> Mark all as read
            </button>
          </div>

        
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setfillter('all')}
              className={`rounded-full px-5 py-2 font-semibold ${fillter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setfillter('unread')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 font-semibold ${fillter === 'unread' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-gray-700 hover:bg-slate-200'}`}
            >
              Unread
              {unreadcount > 0 && (
                <span className="rounded-full bg-white px-2 text-sm text-blue-600">{unreadcount}</span>
              )}
            </button>
          </div>
        </div>

        
        <div className="flex flex-col gap-3 p-5">
          {notifications.length === 0 && (
            <p className="py-10 text-center text-gray-500">No notifications here.</p>
          )}

          {shownNotifications.map((element) => {
            const info = typeInfo[element.type]
            return (
              <div
                key={element._id}
                className={`flex gap-4 rounded-2xl border p-5 ${element.isRead ? 'border-gray-200 bg-white' : 'border-blue-100 bg-blue-50'}`}
              >
                <div className="relative h-fit shrink-0">
                  <Avatar img={element.actor.photo} rounded size="md" />
                  <span className={`absolute -right-1 -bottom-6 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs shadow-sm ${info?.color}`}>
                    <i className={info?.icon}></i>
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-gray-700">
                      <Link to={`/user/${element.actor._id}`}
                    className="font-bold text-gray-900 hover:text-blue-600 hover:underline"> {element.actor.name}</Link>{' '}{info?.text} 
                    </p>
                    <div className="flex shrink-0 items-center gap-3 text-sm text-gray-500">
                      {dayjs(element.createdAt).fromNow()}
                      {!element.isRead && <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>}
                    </div>
                  </div>

                  <p className="mt-1 truncate text-gray-600">{element.entity.name ?? element.entity.body}</p>

                  {element.isRead ? (
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600">
                      <i className="fa-solid fa-check"></i> Read
                    </p>
                  ) : (
                    <button
                      onClick={() => handleisread(element._id)}
                      className="mt-3 flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <i className="fa-solid fa-check"></i> Mark as read
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
