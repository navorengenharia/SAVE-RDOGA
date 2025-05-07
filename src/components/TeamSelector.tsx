
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TeamSelectorProps {
  team: string[];
  teamOptions: string[];
  onChange: (team: string[]) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ team, teamOptions, onChange }) => {
  const [newMember, setNewMember] = React.useState('');
  
  const handleAddTeamMember = () => {
    if (!newMember.trim()) return;
    
    if (!team.includes(newMember)) {
      onChange([...team, newMember]);
    }
    
    setNewMember('');
  };

  const handleRemoveMember = (member: string) => {
    onChange(team.filter(m => m !== member));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Nome do membro"
          list="team-options"
        />
        <datalist id="team-options">
          {teamOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
        <Button type="button" onClick={handleAddTeamMember} size="sm">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {team.map((member) => (
          <Badge key={member} variant="secondary" className="flex items-center gap-1">
            {member}
            <button 
              type="button" 
              onClick={() => handleRemoveMember(member)}
              className="ml-1 rounded-full hover:bg-muted p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TeamSelector;
