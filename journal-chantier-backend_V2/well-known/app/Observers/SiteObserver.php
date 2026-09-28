<?php

namespace App\Observers;

use App\Models\Assignment;
use App\Models\Site;
use App\Models\Worker;

class SiteObserver
{
    /**
     * Handle the Site "created" event.
     */
    public function created(Site $site): void
    {
//        $worker = Worker::where('registration_number', $site->worker->registration_number)->first();
//
//        $worker->site()->associate($site);
//
//        $worker->save();
//
//        $assignment = new Assignment();
//
//        $assignment->worker_id = $worker->id;
//
//        $assignment->site_id = $site->id;
//
//        $assignment->save();
    }

    /**
     * Handle the Site "updated" event.
     */
    public function updated(Site $site): void
    {
//        $worker = Worker::where('registration_number', $site->worker->registration_number)->first();
//
//        $worker->site_id = $site->id;
//
//        $worker->save();

//        $assignment = new Assignment();
//
//        $assignment->worker_id = $worker->id;
//
//        $assignment->site_id = $site->id;
//
//        $assignment->save();
    }

    /**
     * Handle the Site "deleted" event.
     */
    public function deleted(Site $site): void
    {
        //
    }

    /**
     * Handle the Site "restored" event.
     */
    public function restored(Site $site): void
    {
        //
    }

    /**
     * Handle the Site "force deleted" event.
     */
    public function forceDeleted(Site $site): void
    {
        //
    }
}
