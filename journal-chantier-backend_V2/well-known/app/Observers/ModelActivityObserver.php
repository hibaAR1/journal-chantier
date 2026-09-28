<?php

namespace App\Observers;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ModelActivityObserver
{
    public function created(Model $model)
    {
        $this->log('created', $model);
    }

    public function updated(Model $model)
    {
        if (property_exists($model, 'skipObserver') && $model->skipObserver) {
            return; // Ne loggue pas si c’est une validation/dévalidation
        }

        $changes = array_keys($model->getChanges());

        // Cas spécial : uniquement "validated" changé → ignorer "updated"
        if (
            count($changes) === 1 &&
            $changes[0] === 'validated' &&
            $model->getOriginal('validated') !== $model->validated
        ) {
            // Ne rien faire ici (car action loggée manuellement dans le controller)
            return;
        }

        $this->log('updated', $model);
    }

    public function deleted(Model $model)
    {
        $this->log('deleted', $model);
    }

    public static function logExport(Model $model)
    {
        self::log('exported', $model);
    }

    public static function logImport(Model $model)
    {
        self::log('imported', $model);
    }

    public static function log(string $action, Model $model)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'data' => $model->toArray(),
        ]);
    }
    public static function logGeneric(string $action, string $modelType, array $data = [])
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => null,
            'data' => $data,
            'ip_address' => Request::ip(),
        ]);
    }

    public static function logSystem(string $action, Model $model)
    {
        ActivityLog::create([
            'user_id' => null, //système
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'data' => $model->toArray(),
        ]);
    }


}
