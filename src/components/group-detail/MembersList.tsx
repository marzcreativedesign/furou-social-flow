
import React from 'react';
import { GroupMember } from './types';
import { MemberCard } from './MemberCard';

interface MembersListProps {
  members: GroupMember[];
  isOwner: boolean;
  isAdmin: boolean;
  onUpdateRole: (member: GroupMember, isNewAdmin: boolean) => Promise<void>;
  onRemove: (member: GroupMember) => Promise<void>;
}

const MembersList = ({ members, isOwner, isAdmin, onUpdateRole, onRemove }: MembersListProps) => {
  return (
    <div className="space-y-4">
      {members.map(member => (
        <MemberCard
          key={member.id}
          member={member}
          isOwner={isOwner}
          isAdmin={isAdmin}
          onUpdateRole={onUpdateRole}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default MembersList;
