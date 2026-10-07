<?php

namespace App\Http\Controllers;

use App\Queries\DashboardQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Learning Overview for the account (PRD 27, API spec 5.1).
     *
     * Every number is aggregated server-side by DashboardQuery; the page
     * only renders what it is given.
     */
    public function index(Request $request, DashboardQuery $query): Response
    {
        $user = $request->user();

        abort_if($user === null, 401);

        return Inertia::render('dashboard', [
            'progress' => $query->progress($user),
            'growth' => $query->growth($user),
            'recentKnowledge' => $query->recentKnowledge($user),
            'recentInsights' => $query->recentInsights($user),
            'topCategories' => $query->topCategories($user),
        ]);
    }
}
