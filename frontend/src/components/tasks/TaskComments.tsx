// Import the React tools, services and helpers used for comments.
import { useCallback, useEffect, useState, type FormEvent } from "react";
import * as commentService from "../../services/commentService";
import type { TaskComment } from "../../types/task";
import { CURRENT_USER_NAME } from "../../constants/taskOptions";
import { formatDateTime } from "../../utils/dateHelpers";
import { useToast } from "../../context/ToastContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";

// The list of comments on a task plus a box to write a new one.
export default function TaskComments({ taskId }: { taskId: number }) {
  const { showToast } = useToast();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [newText, setNewText] = useState("");
  const [textError, setTextError] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Load the comments of this task from the API.
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      setComments(await commentService.getCommentsByTask(taskId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not load comments.");
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  // Load again whenever a different task is opened.
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Validate and send the new comment.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newText.trim() === "") {
      setTextError("Write something before you send.");
      return;
    }
    if (newText.length > 300) {
      setTextError("A comment can have at most 300 characters.");
      return;
    }

    setIsSending(true);
    try {
      const createdComment = await commentService.addComment(taskId, CURRENT_USER_NAME, newText.trim());
      setComments((currentComments) => [...currentComments, createdComment]);
      setNewText("");
      setTextError("");
      showToast("Comment added.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not add the comment.", "error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section aria-label="Comments">
      <h3 className="mb-3 text-sm font-bold text-gray-800">Comments ({comments.length})</h3>

      {isLoading && <Spinner message="Loading comments..." />}
      {errorMessage && <ErrorState message={errorMessage} onRetry={loadComments} />}

      {!isLoading && !errorMessage && comments.length === 0 && (
        <p className="mb-3 text-sm text-gray-500">No comments yet. Start the conversation below.</p>
      )}

      <ul className="mb-4 flex flex-col gap-3">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-2">
            <Avatar name={comment.author} />
            <div className="rounded-lg bg-gray-100 px-3 py-2">
              <p className="text-xs font-semibold text-gray-700">
                {comment.author} <span className="font-normal text-gray-500">{formatDateTime(comment.createdAt)}</span>
              </p>
              <p className="mt-0.5 text-sm text-gray-800">{comment.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
        <label htmlFor={`comment-${taskId}`} className="sr-only">Write a comment</label>
        <textarea
          id={`comment-${taskId}`}
          rows={2}
          value={newText}
          onChange={(event) => { setNewText(event.target.value); setTextError(""); }}
          aria-invalid={Boolean(textError)}
          placeholder="Write a comment..."
          className={`w-full rounded-lg border px-3 py-2 text-sm ${textError ? "border-red-500" : "border-gray-300"}`}
        />
        {textError && <p className="text-xs font-medium text-red-600">{textError}</p>}
        <Button type="submit" isLoading={isSending} className="self-end">Send comment</Button>
      </form>
    </section>
  );
}
