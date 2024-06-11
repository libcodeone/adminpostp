<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class VerifyPtokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:ptokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $expiredTokens = DB::table('pos_auth_tokens')->where("status", '=', true)->get();

        foreach ($expiredTokens as $token) {
            if (Carbon::parse($token->created_at)->diffInSeconds(Carbon::parse(date("Y-m-d H:i:s.mmm"))) >= 3600)
            {
                DB::table("pos_auth_tokens")->where("id", '=', $token->id)->update(
                    [
                        'status' => false
                    ]
                );
            }
            else
                continue;
        }
    }
}
