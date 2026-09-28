<?php

namespace App\Observers;

use App\Models\AssignmentWorker;
use App\Models\Worker;

class AssignmentWorkerObserver
{
    /**
     * Handle the AssignmentWorker "created" event.
     *
     * @param \App\Models\AssignmentWorker $assignmentWorker
     * @return void
     */
    public function created($assignmentWorker)
    {
        $worker = Worker::where('id', $assignmentWorker->worker_id)->first();

        $worker->site_id = $assignmentWorker->assignment->site_id;

        $worker->save();
    }

    /**
     * Handle the AssignmentWorker "updated" event.
     *
     * @param \App\Models\AssignmentWorker $assignmentWorker
     * @return void
     */
    public function updated($assignmentWorker)
    {
        // old worker_id:
//        $oldWorkerId = $assignmentWorker->getOriginal('worker_id');
//
//        if ($oldWorkerId != $assignmentWorker->worker_id) {
//            $oldWorker = Worker::where('id', $oldWorkerId)->first();
//
//            // Old assignment id
//            $oldAssignmentId = $assignmentWorker->getOriginal('assignment_id');
//
//            // get latest assignmentWorker where worker_id is oldWorkerId and assignment_id not equal to oldAssignmentId
//            $latestAssignmentWorker = AssignmentWorker::where('worker_id', $oldWorkerId)
//                ->where('assignment_id', '!=', $oldAssignmentId)
//                ->latest()
//                ->first();
//
//            // If latestAssignmentWorker is not null, then update the worker's site_id
//            if ($latestAssignmentWorker) {
//                $oldWorker->site_id = $latestAssignmentWorker->assignment->site_id;
//            } else {
//                $oldWorker->site_id = null;
//            }
//
//            $oldWorker->save();
//        }

        $worker = Worker::where('id', $assignmentWorker->worker_id)->first();

        $worker->site_id = $assignmentWorker->assignment->site_id;

        $worker->save();
    }

    /**
     * Handle the AssignmentWorker "deleted" event.
     *
     * @param \App\Models\AssignmentWorker $assignmentWorker
     * @return void
     */
    public function deleted($assignmentWorker)
    {
        $worker = Worker::where('id', $assignmentWorker->worker_id)->first();

        // get latest assignmentWorker where worker_id is assignmentWorker->worker_id
        $latestAssignmentWorker = AssignmentWorker::where('worker_id', $assignmentWorker->worker_id)
            ->where('assignment_id', '!=', $assignmentWorker->assignment_id)
            ->latest()
            ->first();

        // If latestAssignmentWorker is not null, then update the worker's site_id
        if ($latestAssignmentWorker) {
            $worker->site_id = $latestAssignmentWorker->assignment->site_id;
        } else {
            $worker->site_id = null;
        }

        $worker->save();
    }
}
