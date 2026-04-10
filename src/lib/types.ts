export interface NoteMetadata {
	slug: string;          // URL-safe relative path, e.g. "Databases/postgres/MVCC"
	title: string;         // frontmatter title or derived from filename
	date: Date;            // modified > date > file mtime
	tags: string[];        // from frontmatter
	folder: string;        // top-level folder name, e.g. "Databases"
	filePath: string;      // absolute path on disk
}

export interface Note extends NoteMetadata {
	html: string;          // processed HTML content
	plainText: string;     // stripped text for search
}

export interface FolderTreeEntry {
	name: string;
	slug?: string;         // only for notes
	isFolder: boolean;
	children?: FolderTreeEntry[];
}
