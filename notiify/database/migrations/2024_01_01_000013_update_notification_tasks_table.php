<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Проверяем существование колонок перед изменением
        if (Schema::hasColumn('notification_tasks', 'created_by')) {
            Schema::table('notification_tasks', function (Blueprint $table) {
                $table->renameColumn('created_by', 'operator_id');
            });
        }
        
        if (Schema::hasColumn('notification_tasks', 'trip_ids')) {
            Schema::table('notification_tasks', function (Blueprint $table) {
                $table->dropColumn('trip_ids');
            });
        }
        
        // Добавляем новые колонки
        Schema::table('notification_tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('notification_tasks', 'races_data')) {
                $table->json('races_data')->nullable()->after('operator_id');
            }
            if (!Schema::hasColumn('notification_tasks', 'template')) {
                $table->text('template')->nullable()->after('races_data');
            }
        });
    }

    public function down(): void
    {
        Schema::table('notification_tasks', function (Blueprint $table) {
            $table->dropColumn(['races_data', 'template']);
            $table->json('trip_ids')->after('operator_id');
            $table->renameColumn('operator_id', 'created_by');
        });
    }
};

