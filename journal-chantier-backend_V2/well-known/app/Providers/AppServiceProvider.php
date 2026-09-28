<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\AssignmentWorker;
use App\Models\Bucket;
use App\Models\Client;
use App\Models\Counter;
use App\Models\Credit;
use App\Models\Loan;
use App\Models\Location;
use App\Models\Movement;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Punch;
use App\Models\PunchWorker;
use App\Models\Repayment;
use App\Models\Report;
use App\Models\ReportWorkType;
use App\Models\ReportWorkTypeWorker;
use App\Models\Resource;
use App\Models\Restitution;
use App\Models\Site;
use App\Models\SiteLocation;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Work;
use App\Models\Worker;
use App\Models\WorkType;
use App\Observers\AssignmentWorkerObserver;
use App\Observers\BucketObserver;
use App\Observers\CreditObserver;
use App\Observers\LoanObserver;
use App\Observers\ModelActivityObserver;
use App\Observers\RepaymentObserver;
use App\Observers\RestitutionObserver;
use App\Observers\SiteObserver;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Site::observe(SiteObserver::class);
        AssignmentWorker::observe(AssignmentWorkerObserver::class);

        Assignment::observe(ModelActivityObserver::class);
        AssignmentWorker::observe(ModelActivityObserver::class);
        Client::observe(ModelActivityObserver::class);
        Counter::observe(ModelActivityObserver::class);
        Location::observe(ModelActivityObserver::class);
        Movement::observe(ModelActivityObserver::class);
        Product::observe(ModelActivityObserver::class);
        ProductCategory::observe(ModelActivityObserver::class);
        Punch::observe(ModelActivityObserver::class);
        PunchWorker::observe(ModelActivityObserver::class);
        Report::observe(ModelActivityObserver::class);
        ReportWorkType::observe(ModelActivityObserver::class);
        ReportWorkTypeWorker::observe(ModelActivityObserver::class);
        Resource::observe(ModelActivityObserver::class);
        Site::observe(ModelActivityObserver::class);
        SiteLocation::observe(ModelActivityObserver::class);
        Supplier::observe(ModelActivityObserver::class);
        User::observe(ModelActivityObserver::class);
        Work::observe(ModelActivityObserver::class);
        Worker::observe(ModelActivityObserver::class);
        WorkType::observe(ModelActivityObserver::class);
    }
}
