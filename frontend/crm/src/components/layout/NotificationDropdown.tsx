import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, RefreshCw, Info, CalendarCheck, Car, Compass, AlertCircle } from 'lucide-react';
import { getApiBaseUrl } from '@/api/client';
import { useNavigate } from 'react-router-dom';

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  onClose?: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('crm_token');
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/api/notifications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const json = await res.json();
        const list: NotificationItem[] = json.notifications || json.data || [];
        setNotifications(list);
        setUnreadCount(
          typeof json.unreadCount === 'number'
            ? json.unreadCount
            : list.filter((n) => !n.isRead).length
        );
      }
    } catch {
      // Ignore network errors in background poll
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const token = localStorage.getItem('crm_token');
      const base = getApiBaseUrl();
      await fetch(`${base}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('crm_token');
      const base = getApiBaseUrl();
      await fetch(`${base}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications read', err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (n: NotificationItem) => {
    if (!n.isRead) {
      markAsRead(n._id);
    }
    setIsOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'booking':
      case 'booking_created':
        return <CalendarCheck className="w-4 h-4 text-[#C65A2E]" />;
      case 'car':
      case 'fleet':
        return <Car className="w-4 h-4 text-[#2D1F18]" />;
      case 'tour':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'alert':
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-[#C65A2E]" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="crm-notification-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Open notifications"
        className="w-8 h-8 rounded-full bg-white border border-[#EDE2D0] flex items-center justify-center text-[#2D1F18] hover:text-[#C65A2E] hover:border-[#C65A2E]/50 shadow-xs transition-all relative shrink-0 cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#C65A2E] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#EDE2D0] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-[#F8EFEA] border-b border-[#EDE2D0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#2D1F18] uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#C65A2E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-[11px] font-semibold text-[#C65A2E] hover:text-[#B24E25] flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={fetchNotifications}
                title="Refresh notifications"
                className="p-1 text-gray-500 hover:text-[#2D1F18] rounded hover:bg-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#EDE2D0]/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#2D1F18]" />
                <p className="text-xs font-medium text-gray-600">No notifications yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  New bookings and customer inquiries will appear here
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3.5 hover:bg-[#F8EFEA] transition-colors cursor-pointer flex gap-3 items-start relative ${
                    !n.isRead ? 'bg-[#C65A2E]/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#EDE2D0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          !n.isRead ? 'text-[#2D1F18]' : 'text-gray-700'
                        }`}
                      >
                        {n.title}
                      </p>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={(e) => markAsRead(n._id, e)}
                      title="Mark as read"
                      className="absolute right-2 top-3 p-1 text-gray-400 hover:text-[#C65A2E] rounded-full hover:bg-white"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#C65A2E] block" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-[#F8EFEA] border-t border-[#EDE2D0] text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/bookings');
              }}
              className="text-[11px] font-bold text-[#C65A2E] hover:text-[#B24E25] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View all bookings & inquiries</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
