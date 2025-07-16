import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3,
  FileText,
  Save,
  Download,
  Share2,
  Undo,
  Redo
} from 'lucide-react';

interface ToolbarGroupProps {
  children: React.ReactNode;
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children }) => (
  <div className="flex items-center space-x-1 border-r border-gray-200 pr-1">
    {children}
  </div>
);

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, title, onClick, active }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded-md ${
      active 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } transition-colors`}
  >
    {icon}
  </button>
);

interface EditorToolbarProps {
  onAction: (action: string) => void;
  activeStyles: string[];
  undoable: boolean;
  redoable: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onAction,
  activeStyles = [],
  undoable = false,
  redoable = false
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-1 flex flex-wrap items-center">
      {/* Text formatting */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<Bold className="h-4 w-4" />}
          title="Gras"
          onClick={() => onAction('bold')}
          active={activeStyles.includes('bold')}
        />
        <ToolbarButton
          icon={<Italic className="h-4 w-4" />}
          title="Italique"
          onClick={() => onAction('italic')}
          active={activeStyles.includes('italic')}
        />
        <ToolbarButton
          icon={<Underline className="h-4 w-4" />}
          title="Souligné"
          onClick={() => onAction('underline')}
          active={activeStyles.includes('underline')}
        />
      </ToolbarGroup>
      
      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<Heading1 className="h-4 w-4" />}
          title="Titre 1"
          onClick={() => onAction('h1')}
          active={activeStyles.includes('h1')}
        />
        <ToolbarButton
          icon={<Heading2 className="h-4 w-4" />}
          title="Titre 2"
          onClick={() => onAction('h2')}
          active={activeStyles.includes('h2')}
        />
        <ToolbarButton
          icon={<Heading3 className="h-4 w-4" />}
          title="Titre 3"
          onClick={() => onAction('h3')}
          active={activeStyles.includes('h3')}
        />
      </ToolbarGroup>
      
      {/* Alignment */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<AlignLeft className="h-4 w-4" />}
          title="Aligner à gauche"
          onClick={() => onAction('alignLeft')}
          active={activeStyles.includes('alignLeft')}
        />
        <ToolbarButton
          icon={<AlignCenter className="h-4 w-4" />}
          title="Centrer"
          onClick={() => onAction('alignCenter')}
          active={activeStyles.includes('alignCenter')}
        />
        <ToolbarButton
          icon={<AlignRight className="h-4 w-4" />}
          title="Aligner à droite"
          onClick={() => onAction('alignRight')}
          active={activeStyles.includes('alignRight')}
        />
      </ToolbarGroup>
      
      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<List className="h-4 w-4" />}
          title="Liste à puces"
          onClick={() => onAction('bulletList')}
          active={activeStyles.includes('bulletList')}
        />
        <ToolbarButton
          icon={<ListOrdered className="h-4 w-4" />}
          title="Liste numérotée"
          onClick={() => onAction('orderedList')}
          active={activeStyles.includes('orderedList')}
        />
      </ToolbarGroup>
      
      {/* Insert */}
      <ToolbarGroup>
        <ToolbarButton
          icon={<Link className="h-4 w-4" />}
          title="Insérer un lien"
          onClick={() => onAction('link')}
        />
        <ToolbarButton
          icon={<Image className="h-4 w-4" />}
          title="Insérer une image"
          onClick={() => onAction('image')}
        />
        <ToolbarButton
          icon={<Table className="h-4 w-4" />}
          title="Insérer un tableau"
          onClick={() => onAction('table')}
        />
        <ToolbarButton
          icon={<FileText className="h-4 w-4" />}
          title="Insérer un modèle"
          onClick={() => onAction('template')}
        />
      </ToolbarGroup>
      
      {/* History */}
      <div className="flex items-center space-x-1 ml-auto">
        <ToolbarButton
          icon={<Undo className="h-4 w-4" />}
          title="Annuler"
          onClick={() => onAction('undo')}
        />
        <ToolbarButton
          icon={<Redo className="h-4 w-4" />}
          title="Rétablir"
          onClick={() => onAction('redo')}
        />
      </div>
      
      {/* Document actions */}
      <div className="flex items-center space-x-1">
        <ToolbarButton
          icon={<Save className="h-4 w-4" />}
          title="Enregistrer"
          onClick={() => onAction('save')}
        />
        <ToolbarButton
          icon={<Download className="h-4 w-4" />}
          title="Télécharger"
          onClick={() => onAction('download')}
        />
        <ToolbarButton
          icon={<Share2 className="h-4 w-4" />}
          title="Partager"
          onClick={() => onAction('share')}
        />
      </div>
    </div>
  );
};