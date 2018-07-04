// Copyright 2018 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Flags: --expose-async-hooks

// Check for correct API methods
(function() {
  assertTrue(async_hooks.hasOwnProperty('createHook'),
    'Async hooks missing createHook method');
  assertTrue(async_hooks.hasOwnProperty('executionAsyncId'),
    'Async hooks missing executionAsyncId method');
  assertTrue(async_hooks.hasOwnProperty('triggerAsyncId'),
    'Async hooks missing triggerAsyncId method');

  let ah = async_hooks.createHook({});
  assertTrue(ah.hasOwnProperty('enable'), 'Async hooks missing enable method');
  assertTrue(ah.hasOwnProperty('disable'),
    'Async hooks missing disable method');
})();

// Check for correct enabling/disabling of async hooks
(function() {
  let storedPromise;
  let ah = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) {
      storedPromise = resource.promise || resource;
    }
  });
  ah.enable();

  let createdPromise = new Promise(function(resolve) {
    resolve(42);
  });
  assertSame(storedPromise, createdPromise,
    "Async hooks weren't enabled correctly");
  ah.disable();
  createdPromise = Promise.resolve(52);
  assertNotSame(storedPromise, createdPromise,
    "Async hooks weren't disabled correctly");
  ah.enable();
  createdPromise = Promise.resolve(62);
  assertSame(storedPromise, createdPromise,
    "Async hooks weren't enabled correctly");
})();
