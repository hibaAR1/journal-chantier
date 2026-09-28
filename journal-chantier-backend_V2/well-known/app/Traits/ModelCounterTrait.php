<?php

namespace App\Traits;

use App\Models\Counter;
use Carbon\Carbon;

trait ModelCounterTrait {
    public function codeGenerator(array $elements) : string {
        $year = Carbon::now()->format('y');
        $month = Carbon::now()->format('m');
        $prefix = $elements["prefix"] . $year . $month;

        // Get the counter for the current year and month
        $counter = Counter::where([
            ["year", intval($year)],
            ["month", intval($month)],
            ["model", $elements["model"]],
        ])->first();

        if ($counter) {
            $newSequence = $counter->count + 1;
            $counter->count = $newSequence;
            $counter->save();
        } else {
            $newSequence = 1;
            $counter = new Counter();
            $counter->year = intval($year);
            $counter->month = intval($month);
            $counter->model = $elements["model"];
            $counter->count = $newSequence;
            $counter->save();
        }

        $sequencePadded = str_pad($newSequence, $elements['length'], '0', STR_PAD_LEFT);

        return $prefix . '-' . $sequencePadded;
    }
}
