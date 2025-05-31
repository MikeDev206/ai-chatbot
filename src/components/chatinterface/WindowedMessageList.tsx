import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../../services/api';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Tooltip from '@mui/material/Tooltip';
import CapitalLetters from '../CapitalLetters';
import DisneyLogo from '../../assets/img/logos/walt-disney-D.svg';

interface WindowedMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleProfilePicClick = () => {
    if (isUser && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        // Here you would typically send this to your backend
        localStorage.setItem('userProfilePic', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Load profile picture from localStorage on component mount
    const savedProfilePic = localStorage.getItem('userProfilePic');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }
  }, []);

  const formatRideData = (text: string) => {
    try {
      // Check if the text contains ride data
      if (text.includes('"_id"') && text.includes('"totalAvailability"')) {
        const rides = text.match(/\{"_id":"([^"]+)","totalAvailability":(\d+)\}/g) || [];
        const timestamp = text.match(/\d{2}:\d{2}\s*hrs/) || [];
        const responseTime = text.match(/We took \d+(\.\d+)?[ms]+ to answer/) || [];

        if (rides.length > 0) {
          return (
            <>
              <div className={`ride-list ${rides.length > 6 ? 'two-columns' : ''}`}>
                {rides.map((ride, index) => {
                  const { _id, totalAvailability } = JSON.parse(ride);
                  return (
                    <div key={index} className="ride-item">
                      <span className="ride-name">
                        <CapitalLetters text={_id.replace(/([A-Z])/g, ' $1').trim()} />
                      </span>
                      <span className="ride-availability">
                        <ConfirmationNumberIcon className="ticket-icon" />
                        <CapitalLetters text={`${totalAvailability} tickets`} />
                      </span>
                    </div>
                  );
                })}
              </div>
              {timestamp.length > 0 && <div className="timestamp">{timestamp[0]}</div>}
              {responseTime.length > 0 && <div className="response-footer">{responseTime[0]}</div>}
            </>
          );
        }
      }
      return <CapitalLetters text={message.text} />;
    } catch (error) {
      return <CapitalLetters text={message.text} />;
    }
  };

  const renderAvatar = () => {
    if (isUser) {
      return (
        <Tooltip 
          title={
            <div className="profile-upload-tooltip">
              <CapitalLetters text="Update Photo" />
              <AddAPhotoIcon className="upload-icon" />
            </div>
          }
          placement="right"
          arrow
        >
          <div 
            className={`message-avatar user-avatar ${profilePic ? 'has-profile-pic' : ''}`}
            onClick={handleProfilePicClick}
            style={{ cursor: 'pointer' }}
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <PersonIcon />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              aria-label="Upload profile picture"
            />
          </div>
        </Tooltip>
      );
    }
    
    return (
      <div className={`message-avatar bot-avatar`}>
        <img src={DisneyLogo} alt="Disney" className="disney-avatar" />
      </div>
    );
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      {renderAvatar()}
      <div className="message-bubble">
        <div className="message-content">
          {formatRideData(message.text)}
        </div>
        <div className="message-timestamp">
          {format24HourTime(message.timestamp)}
          {!isUser && message.responseTime && (
            <span className="response-time">
              We took ⏱ {formatResponseTime(message.responseTime)} to answer
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const formatResponseTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

const format24HourTime = (date: Date): string => {
  const time = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${time} hrs`;
};

const BATCH_SIZE = 20; // Number of messages to render at once

const WindowedMessageList: React.FC<WindowedMessageListProps> = ({ messages, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    // Update visible messages when the messages array changes
    const start = Math.max(0, messages.length - BATCH_SIZE);
    setStartIndex(start);
    setVisibleMessages(messages.slice(start));
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop } = containerRef.current;
    
    // Load more messages when scrolling up
    if (scrollTop === 0 && startIndex > 0) {
      const newStart = Math.max(0, startIndex - BATCH_SIZE);
      setStartIndex(newStart);
      setVisibleMessages(messages.slice(newStart, startIndex + BATCH_SIZE));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="chat-messages"
      onScroll={handleScroll}
    >
      {visibleMessages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="message bot-message">
          <div className="message-avatar bot-avatar">
            <img src={DisneyLogo} alt="Disney" className="disney-avatar" />
          </div>
          <div className="message-bubble">
            <div className="message-content">
              <div className="gooey-loader">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WindowedMessageList; 