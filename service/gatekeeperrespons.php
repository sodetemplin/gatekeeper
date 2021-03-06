<?php
/**
 * ownCloud - 
 *
 * @author Marc DeXeT
 * @copyright 2014 DSI CNRS https://www.dsi.cnrs.fr
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\GateKeeper\Service;

class GateKeeperRespons {

	var $cause;
	var $uid;
	var $group;
	var $denied = false;
	var $emitted = false;

	/**
	* Set respons in deny mode
	* @param String cause
	* @param mixed vars
	* @return Respons itself (fluent)
	*/
	public function deny($cause, $uid, $group=null) {
		$this->cause = $cause;
		$this->uid = $uid;
		$this->group = $group;
		$this->denied = true;
		return $this;
	}

	public function isDenied(){
		return $this->denied;
	}

	public function isAllow() {
		return ! $this->denied;
	}
	
	public function getCause() {
		return $this->cause;
	}

	public function isEmitted() {
		return $this->emitted;
	}

	public function getUid() {
		return $this->uid;
	}

	public function getGroup() {
		return $this->group;
	}

	public static function yetGranted() {
		$r = new GateKeeperRespons();
		$r->emitted = true;
		$r->cause = 'yet granted';
		return $r;
	}

	public static function yetDenied() {
		$r = new GateKeeperRespons();
		$r->emitted = true;
		$r->denied = true;
		$r->cause = 'yet denied';
		return $r;
	}

	public function __toString() {
		return "denied={$this->denied},uid={$this->uid},group={$this->group},cause={$this->cause}";
	}

}