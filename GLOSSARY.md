# Visual Git Learning

The Git concepts explained by the learning website, from local work through a first push to a remote repository.

## Language

**Working directory**:
The files you can inspect and edit in the project folder, including checked-out tracked files and untracked files. Staging a file's contents does not remove the file from the working directory.
_Avoid_: workspace (when referring specifically to Git's working files)

**Staging area**:
The proposed contents of the next commit, also called Git's index. Staging records selected file contents; later working-directory edits do not automatically update those contents.
_Avoid_: upload queue, moved files

**Commit**:
A recorded repository snapshot with metadata and parent relationships. Its snapshot is formed from the staging area, not automatically from all current working-directory edits.
_Avoid_: saved diff, backup of every current edit

**Local repository**:
The Git repository on Alice’s computer, containing recorded history and local references. It is distinct from the working directory and from a repository hosted on GitHub.
_Avoid_: project folder (when referring specifically to the repository)

**Remote repository**:
A Git repository at another location, such as GitHub, with which the local repository can exchange history. Adding its address locally does not transfer any commits.
_Avoid_: synced folder, automatic backup

**Remote**:
A named connection in a local repository to another repository’s address. `origin` is the conventional name used in this story, not a special GitHub service.
_Avoid_: GitHub (as a synonym for any remote)

**Push**:
A Git operation that sends the needed recorded history to a remote repository and requests updates to its references. Uncommitted working-directory or staged changes are not included.
_Avoid_: upload all files, automatic sync

**Untracked file**:
A working-directory file not recorded in the staging area or the current commit. Initializing a repository does not automatically track its existing files.
_Avoid_: ignored file (unless Git's ignore rules also apply)

**Branch**:
A named, movable reference to a commit. Committing while a branch is current advances that branch; it is not an independent copy of the repository.
_Avoid_: copied folder, separate repository

**HEAD**:
The reference identifying the current checkout. In this course it points to the current branch; before the first commit, that branch has no commit yet.
_Avoid_: latest commit anywhere, main (as a synonym)

**Merge commit**:
A commit with more than one parent, recording the result of joining histories. The course uses a two-parent merge of non-conflicting changes.
_Avoid_: squashed commit, copied branch

**Upstream**:
The configured remote-tracking branch associated with a local branch. In this story it establishes the default destination for subsequent pushes from main.
_Avoid_: automatic synchronization
